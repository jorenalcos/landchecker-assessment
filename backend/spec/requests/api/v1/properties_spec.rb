require "rails_helper"

RSpec.describe "API V1 Properties", type: :request do
  let(:password) { "SecurePassword123" }
  let(:user) do
    User.create!(
      email: "property-test@example.com",
      password: password,
      role: "admin"
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

    it "filters properties by property type" do
      house = Property.create!(valid_attributes.merge(property_type: "house"))
      Property.create!(valid_attributes.merge(property_type: "apartment"))

      get "/api/v1/properties?property_type=house",
          headers: headers,
          as: :json

      json = JSON.parse(response.body)

      expect(response).to have_http_status(:ok)
      expect(json["properties"].map { |p| p["id"] }).to eq([house.id])
    end

    it "filters properties by status" do
      available = Property.create!(valid_attributes.merge(status: "available"))
      Property.create!(valid_attributes.merge(status: "sold"))

      get "/api/v1/properties?status=available",
          headers: headers,
          as: :json

      json = JSON.parse(response.body)

      expect(json["properties"].map { |p| p["id"] }).to eq([available.id])
    end

    it "filters properties by price range" do
      affordable = Property.create!(valid_attributes.merge(price: 2_000_000))
      Property.create!(valid_attributes.merge(price: 8_000_000))

      get "/api/v1/properties?min_price=1000000&max_price=5000000",
          headers: headers,
          as: :json

      json = JSON.parse(response.body)

      expect(json["properties"].map { |p| p["id"] }).to eq([affordable.id])
    end

    it "searches properties by title" do
      matching = Property.create!(
        valid_attributes.merge(title: "Modern House in Carcar")
      )

      Property.create!(
        valid_attributes.merge(
          title: "Beachfront Apartment",
          address: "Cebu City, Cebu"
        )
      )

      get "/api/v1/properties?search=Modern House",
          headers: headers,
          as: :json

      json = JSON.parse(response.body)

      expect(response).to have_http_status(:ok)
      expect(json["properties"].map { |p| p["id"] }).to eq([matching.id])
    end

    it "searches properties by address" do
      matching = Property.create!(
        valid_attributes.merge(
          title: "Modern Family House",
          address: "Carcar City, Cebu"
        )
      )

      Property.create!(
        valid_attributes.merge(
          title: "Beachfront Apartment",
          address: "Cebu City, Cebu"
        )
      )

      get "/api/v1/properties?search=Carcar",
          headers: headers,
          as: :json

      json = JSON.parse(response.body)

      expect(response).to have_http_status(:ok)
      expect(json["properties"].map { |p| p["id"] }).to eq([matching.id])
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
    
    it "returns pagination metadata" do
      15.times do |i|
        Property.create!(
          valid_attributes.merge(title: "Property #{i}")
        )
      end

      get "/api/v1/properties?page=1&per_page=10",
          headers: headers,
          as: :json

      expect(response).to have_http_status(:ok)

      json = json_response

      expect(json["properties"].size).to eq(10)
      expect(json["meta"]["current_page"]).to eq(1)
      expect(json["meta"]["per_page"]).to eq(10)
      expect(json["meta"]["total_count"]).to eq(15)
      expect(json["meta"]["total_pages"]).to eq(2)
    end

    it "returns the second page of properties" do
      15.times do |i|
        Property.create!(
          valid_attributes.merge(title: "Property #{i}")
        )
      end

      get "/api/v1/properties?page=2&per_page=10",
          headers: headers,
          as: :json

      expect(response).to have_http_status(:ok)
      expect(json_response["properties"].size).to eq(5)
      expect(json_response["meta"]["current_page"]).to eq(2)
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
