require "rails_helper"

RSpec.describe "API V1 Properties", type: :request do
  let(:password) { "SecurePassword123" }
  let(:user) do
    User.create!(
      email: "property-owner@example.com",
      password: password
    )
  end

  let(:token) { JsonWebToken.encode(user_id: user.id) }
  let(:headers) do
    {
      "Authorization" => "Bearer #{token}",
      "Content-Type" => "application/json"
    }
  end

  let(:valid_attributes) do
    {
      title: "Modern Family House",
      description: "A beautiful family home",
      price: 2500000,
      bedrooms: 3,
      bathrooms: 2,
      property_type: "house",
      address: "Carcar City, Cebu"
    }
  end

  def json_response
    JSON.parse(response.body)
  end

  describe "GET /api/v1/properties" do
    it "returns all properties" do
      Property.create!(valid_attributes)

      get "/api/v1/properties", as: :json

      expect(response).to have_http_status(:ok)
      expect(json_response["properties"].size).to eq(1)
    end
  end

  describe "GET /api/v1/properties/:id" do
    it "returns a property" do
      property = Property.create!(valid_attributes)

      get "/api/v1/properties/#{property.id}", as: :json

      expect(response).to have_http_status(:ok)
      expect(json_response.dig("property", "title"))
        .to eq("Modern Family House")
    end

    it "returns not found for an unknown property" do
      get "/api/v1/properties/999999", as: :json

      expect(response).to have_http_status(:not_found)
    end
  end

  describe "POST /api/v1/properties" do
    it "creates a property with valid attributes" do
      expect {
        post "/api/v1/properties",
             params: { property: valid_attributes },
             headers: headers,
             as: :json
      }.to change(Property, :count).by(1)

      expect(response).to have_http_status(:created)
      expect(json_response.dig("property", "title"))
        .to eq("Modern Family House")
    end

    it "rejects requests without authentication" do
      post "/api/v1/properties",
           params: { property: valid_attributes },
           as: :json

      expect(response).to have_http_status(:unauthorized)
    end

    it "rejects invalid attributes" do
      post "/api/v1/properties",
           params: {
             property: valid_attributes.merge(price: -100)
           },
           headers: headers,
           as: :json

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "PATCH /api/v1/properties/:id" do
    let!(:property) { Property.create!(valid_attributes) }

    it "updates a property" do
      patch "/api/v1/properties/#{property.id}",
            params: {
              property: { title: "Updated Family House" }
            },
            headers: headers,
            as: :json

      expect(response).to have_http_status(:ok)
      expect(property.reload.title).to eq("Updated Family House")
    end

    it "rejects requests without authentication" do
      patch "/api/v1/properties/#{property.id}",
            params: {
              property: { title: "Updated Family House" }
            },
            as: :json

      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "DELETE /api/v1/properties/:id" do
    let!(:property) { Property.create!(valid_attributes) }

    it "deletes a property" do
      expect {
        delete "/api/v1/properties/#{property.id}",
               headers: headers,
               as: :json
      }.to change(Property, :count).by(-1)

      expect(response).to have_http_status(:ok)
    end

    it "rejects requests without authentication" do
      delete "/api/v1/properties/#{property.id}", as: :json

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
