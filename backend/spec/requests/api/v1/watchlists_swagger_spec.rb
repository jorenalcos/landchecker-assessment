require "swagger_helper"

WATCHLIST_PROPERTY_SCHEMA = {
  type: :object,
  properties: {
    id: { type: :integer },
    title: { type: :string },
    description: { type: :string, nullable: true },
    price: { type: :string },
    bedrooms: { type: :integer },
    bathrooms: { type: :integer, nullable: true },
    property_type: { type: :string },
    address: { type: :string },
    status: { type: :string }
  }
}.freeze

WATCHLIST_SCHEMA = {
  type: :object,
  properties: {
    id: { type: :integer },
    property: WATCHLIST_PROPERTY_SCHEMA,
    created_at: { type: :string, format: :"date-time" }
  }
}.freeze

RSpec.describe "API V1 Watchlists", type: :request do
  let(:password) { "SecurePassword123" }

  let(:user) do
    User.create!(
      email: "watchlist@example.com",
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
  let(:Authorization) { "Bearer #{token}" }

  path "/api/v1/watchlists" do
    get "List user's watchlist" do
      tags "Watchlists"
      produces "application/json"
      security [{ bearerAuth: [] }]

      response "200", "Watchlist retrieved successfully" do
        schema type: :object,
               properties: {
                 watchlists: {
                   type: :array,
                   items: WATCHLIST_SCHEMA
                 }
               }

        before do
          user.watchlists.create!(property: property)
        end

        run_test!
      end

      response "401", "Unauthorized" do
        let(:Authorization) { nil }

        run_test!
      end
    end

    post "Add property to watchlist" do
      tags "Watchlists"
      consumes "application/json"
      produces "application/json"
      security [{ bearerAuth: [] }]

      parameter name: :watchlist,
                in: :body,
                required: true,
                schema: {
                  type: :object,
                  properties: {
                    property_id: { type: :integer }
                  },
                  required: [:property_id]
                }

      response "201", "Property added to watchlist" do
        let(:watchlist) do
          { property_id: property.id }
        end

        schema type: :object,
               properties: {
                 message: { type: :string },
                 watchlist: WATCHLIST_SCHEMA
               }

        run_test!
      end

      response "422", "Watchlist validation failed" do
        let(:watchlist) do
          { property_id: property.id }
        end

        before do
          user.watchlists.create!(property: property)
        end

        schema type: :object,
               properties: {
                 errors: {
                   type: :array,
                   items: { type: :string }
                 }
               }

        run_test!
      end

      response "401", "Unauthorized" do
        let(:Authorization) { nil }
        let(:watchlist) { { property_id: 1 } }

        run_test!
      end
    end
  end

  path "/api/v1/watchlists/{id}" do
    parameter name: :id,
              in: :path,
              type: :integer,
              description: "Watchlist ID"

    delete "Remove property from watchlist" do
      tags "Watchlists"
      produces "application/json"
      security [{ bearerAuth: [] }]

      response "200", "Property removed from watchlist" do
        let(:id) do
          user.watchlists.create!(property: property).id
        end

        schema type: :object,
               properties: {
                 message: { type: :string }
               }

        run_test!
      end

      response "401", "Unauthorized" do
        let(:Authorization) { nil }
        let(:id) { 1 }

        run_test!
      end

      response "404", "Watchlist not found" do
        let(:id) { 999999 }

        run_test!
      end
    end
  end
end