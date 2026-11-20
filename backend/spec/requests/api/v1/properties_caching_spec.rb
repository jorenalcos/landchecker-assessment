
require "rails_helper"

RSpec.describe "API V1 Properties Caching", type: :request do
  let(:password) { "SecurePassword123" }

  let(:user) do
    User.create!(
      email: "property-cache@example.com",
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
      price: 2_500_000,
      bedrooms: 3,
      bathrooms: 2,
      property_type: "house",
      address: "Carcar City, Cebu"
    }
  end

  let(:collection_version_key) do
    "landchecker:properties:collection_version"
  end

  around do |example|
    original_cache = Rails.cache

    Rails.cache = ActiveSupport::Cache::MemoryStore.new

    example.run
  ensure
    Rails.cache = original_cache
  end

  before do
    Rails.cache.clear
  end

  def json_response
    JSON.parse(response.body)
  end

  describe "GET /api/v1/properties" do
    it "uses cached results for repeated listing requests" do
      property = Property.create!(valid_attributes)

      get "/api/v1/properties", as: :json

      expect(response).to have_http_status(:ok)
      expect(json_response["properties"].size).to eq(1)

      # Insert directly into the database, bypassing controller invalidation.
      Property.create!(
        valid_attributes.merge(title: "Another Family House")
      )

      get "/api/v1/properties", as: :json

      expect(response).to have_http_status(:ok)
      expect(json_response["properties"].size).to eq(1)
      expect(json_response["properties"].first["id"]).to eq(property.id)
    end

    it "uses separate cache entries for different filters" do
      house = Property.create!(
        valid_attributes.merge(property_type: "house")
      )

      apartment = Property.create!(
        valid_attributes.merge(property_type: "apartment")
      )

      get "/api/v1/properties?property_type=house", as: :json

      expect(json_response["properties"].map { |p| p["id"] })
        .to eq([house.id])

      get "/api/v1/properties?property_type=apartment", as: :json

      expect(response).to have_http_status(:ok)

      expect(json_response["properties"].map { |p| p["id"] })
        .to eq([apartment.id])
    end

    it "invalidates listing cache after creating a property" do
      Property.create!(valid_attributes)

      get "/api/v1/properties", as: :json

      expect(json_response["properties"].size).to eq(1)

      post "/api/v1/properties",
           params: {
             property: valid_attributes.merge(
               title: "Newly Created Property"
             )
           },
           headers: headers,
           as: :json

      expect(response).to have_http_status(:created)

      get "/api/v1/properties", as: :json

      expect(response).to have_http_status(:ok)
      expect(json_response["properties"].size).to eq(2)
    end

    it "invalidates listing cache after updating a property" do
      property = Property.create!(valid_attributes)

      get "/api/v1/properties", as: :json

      expect(json_response["properties"].first["title"])
        .to eq("Modern Family House")

      patch "/api/v1/properties/#{property.id}",
            params: {
              property: { title: "Updated Family House" }
            },
            headers: headers,
            as: :json

      expect(response).to have_http_status(:ok)

      get "/api/v1/properties", as: :json

      expect(json_response["properties"].first["title"])
        .to eq("Updated Family House")
    end

    it "invalidates listing cache after deleting a property" do
      property = Property.create!(valid_attributes)

      get "/api/v1/properties", as: :json

      expect(json_response["properties"].size).to eq(1)

      delete "/api/v1/properties/#{property.id}",
             headers: headers,
             as: :json

      expect(response).to have_http_status(:ok)

      get "/api/v1/properties", as: :json

      expect(response).to have_http_status(:ok)
      expect(json_response["properties"]).to be_empty
    end
  end

  describe "GET /api/v1/properties/:id" do
    it "returns updated property details after an update" do
      property = Property.create!(valid_attributes)

      get "/api/v1/properties/#{property.id}", as: :json

      expect(response).to have_http_status(:ok)
      expect(json_response.dig("property", "title"))
        .to eq("Modern Family House")

      patch "/api/v1/properties/#{property.id}",
            params: {
              property: { title: "Updated Family House" }
            },
            headers: headers,
            as: :json

      expect(response).to have_http_status(:ok)

      get "/api/v1/properties/#{property.id}", as: :json

      expect(response).to have_http_status(:ok)
      expect(json_response.dig("property", "title"))
        .to eq("Updated Family House")
    end
  end
end
