require "rails_helper"

RSpec.describe "API V1 Watchlists", type: :request do
  let(:password) { "SecurePassword123" }

  let(:user) do
    User.create!(
      email: "watchlist@example.com",
      password: password
    )
  end

  let(:other_user) do
    User.create!(
      email: "other@example.com",
      password: password
    )
  end

  let(:property) do
    Property.create!(
      title: "Modern Family House",
      description: "A beautiful family home",
      price: 2_500_000,
      bedrooms: 3,
      bathrooms: 2,
      property_type: "house",
      address: "Carcar City, Cebu"
    )
  end

  let(:token) { JsonWebToken.encode(user_id: user.id) }
  let(:headers) do
    {
      "Authorization" => "Bearer #{token}",
      "Content-Type" => "application/json"
    }
  end

  def json_response
    JSON.parse(response.body)
  end

  describe "GET /api/v1/watchlists" do
    it "returns the authenticated user's watchlist" do
      user.watchlists.create!(property: property)

      get "/api/v1/watchlists", headers: headers, as: :json

      expect(response).to have_http_status(:ok)
      expect(json_response["watchlists"].size).to eq(1)
      expect(json_response["watchlists"].first.dig("property", "id")).to eq(property.id)
    end

    it "does not return another user's watchlist" do
      user.watchlists.create!(property: property)

      other_property = Property.create!(
        title: "Other Property",
        description: "Another property",
        price: 1_500_000,
        bedrooms: 2,
        bathrooms: 1,
        property_type: "house",
        address: "Cebu City"
      )

      other_user.watchlists.create!(property: other_property)

      get "/api/v1/watchlists", headers: headers, as: :json

      expect(response).to have_http_status(:ok)
      expect(json_response["watchlists"].size).to eq(1)
      expect(json_response["watchlists"].first.dig("property", "id")).to eq(property.id)
    end

    it "rejects unauthenticated requests" do
      get "/api/v1/watchlists", as: :json

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "POST /api/v1/watchlists" do
    it "adds a property to the watchlist" do
      expect {
        post "/api/v1/watchlists",
             params: { property_id: property.id },
             headers: headers,
             as: :json
      }.to change(Watchlist, :count).by(1)

      expect(response).to have_http_status(:created)
    end

    it "rejects duplicate properties" do
      user.watchlists.create!(property: property)

      expect {
        post "/api/v1/watchlists",
             params: { property_id: property.id },
             headers: headers,
             as: :json
      }.not_to change(Watchlist, :count)

      expect(response).to have_http_status(:unprocessable_entity)
    end

    it "rejects invalid property IDs" do
      post "/api/v1/watchlists",
           params: { property_id: 999999 },
           headers: headers,
           as: :json

      expect(response).to have_http_status(:unprocessable_entity)
    end

    it "rejects unauthenticated requests" do
      post "/api/v1/watchlists",
           params: { property_id: property.id },
           as: :json

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "DELETE /api/v1/watchlists/:id" do
    it "removes a property from the watchlist" do
      watchlist = user.watchlists.create!(property: property)

      expect {
        delete "/api/v1/watchlists/#{watchlist.id}",
               headers: headers,
               as: :json
      }.to change(Watchlist, :count).by(-1)

      expect(response).to have_http_status(:ok)
    end

    it "does not allow removing another user's watchlist" do
      watchlist = other_user.watchlists.create!(property: property)

      expect {
        delete "/api/v1/watchlists/#{watchlist.id}",
               headers: headers,
               as: :json
      }.not_to change(Watchlist, :count)

      expect(response).to have_http_status(:not_found)
    end

    it "rejects unauthenticated requests" do
      watchlist = user.watchlists.create!(property: property)

      delete "/api/v1/watchlists/#{watchlist.id}", as: :json

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
