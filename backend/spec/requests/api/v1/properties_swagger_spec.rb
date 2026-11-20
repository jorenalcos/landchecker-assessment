require "swagger_helper"

PROPERTY_SCHEMA = {
  type: :object,
  properties: {
    id: { type: :integer },
    title: { type: :string },
    description: { type: :string, nullable: true },
    price: {
      type: :string,
      example: "2500000.00"
    },
    bedrooms: { type: :integer },
    bathrooms: { type: :integer, nullable: true },
    property_type: { type: :string },
    address: { type: :string },
    status: { type: :string },
    created_at: { type: :string, format: :"date-time" },
    updated_at: { type: :string, format: :"date-time" }
  }
}.freeze

RSpec.describe "API V1 Properties", type: :request do
  let(:user) do
    User.create!(
      email: "property-owner@example.com",
      password: "SecurePassword123"
    )
  end

  let(:token) { JsonWebToken.encode(user_id: user.id) }
  let(:Authorization) { "Bearer #{token}" }

  let(:valid_property) do
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
  

  path "/api/v1/properties" do
    get "List all properties" do
      tags "Properties"
      produces "application/json"

      parameter name: :property_type,
                in: :query,
                type: :string,
                required: false,
                description: "Filter by property type (house, apartment, condo)"

      parameter name: :status,
                in: :query,
                type: :string,
                required: false,
                description: "Filter by property status (available, sold, rented)"

      parameter name: :min_price,
                in: :query,
                type: :number,
                required: false,
                description: "Minimum property price"

      parameter name: :max_price,
                in: :query,
                type: :number,
                required: false,
                description: "Maximum property price"

      parameter name: :search,
                in: :query,
                type: :string,
                required: false,
                description: "Search by property title or address"

      parameter name: :page,
                in: :query,
                type: :integer,
                required: false,
                description: "Page number"

      parameter name: :per_page,
                in: :query,
                type: :integer,
                required: false,
                description: "Number of properties per page (maximum 50)"

      response "200", "Properties retrieved successfully" do
        schema type: :object,
               properties: {
                 properties: {
                   type: :array,
                   items: PROPERTY_SCHEMA
                 }
               }

        run_test!
      end
    end

    post "Create a property" do
      tags "Properties"
      consumes "application/json"
      produces "application/json"
      security [{ bearerAuth: [] }]

      parameter name: :property,
                in: :body,
                required: true,
                schema: {
                  type: :object,
                  properties: {
                    title: { type: :string },
                    description: { type: :string },
                    price: { type: :number, minimum: 0.01 },
                    bedrooms: { type: :integer, minimum: 0 },
                    bathrooms: { type: :integer, nullable: true },
                    property_type: { type: :string },
                    address: { type: :string },
                    status: { type: :string }
                  },
                  required: %w[
                    title price bedrooms property_type address
                  ]
                }

      response "201", "Property created successfully" do
        let(:property) { { property: valid_property } }

        run_test!
      end

      response "422", "Property validation failed" do
        let(:property) do
          { property: valid_property.merge(price: -100) }
        end

        run_test!
      end
    end
  end

  path "/api/v1/properties/{id}" do
    parameter name: :id, in: :path, type: :integer,
              description: "Property ID"

    let(:property_record) do
      Property.create!(
        title: "Modern Family House",
        description: "A beautiful family home",
        price: 2500000,
        bedrooms: 3,
        bathrooms: 2,
        property_type: "house",
        address: "Carcar City, Cebu"
      )
    end

    let(:id) { property_record.id }

    get "Retrieve a property" do
      tags "Properties"
      produces "application/json"

      response "200", "Property retrieved successfully" do
        schema type: :object,
               properties: {
                 property: PROPERTY_SCHEMA
               }

        run_test!
      end

      response "404", "Property not found" do
        let(:id) { 999999 }

        run_test!
      end
    end

    patch "Update a property" do
      tags "Properties"
      consumes "application/json"
      produces "application/json"
      security [{ bearerAuth: [] }]

      parameter name: :property,
                in: :body,
                required: true,
                schema: {
                  type: :object,
                  properties: {
                    title: { type: :string },
                    description: { type: :string },
                    price: { type: :number, minimum: 0.01 },
                    bedrooms: { type: :integer, minimum: 0 },
                    bathrooms: { type: :integer, nullable: true },
                    property_type: { type: :string },
                    address: { type: :string },
                    status: { type: :string }
                  }
                }

      response "200", "Property updated successfully" do
        let(:property) do
          { property: { title: "Updated Family House" } }
        end

        run_test!
      end

      response "422", "Property validation failed" do
        let(:property) do
          { property: { price: -100 } }
        end

        run_test!
      end
    end

    delete "Delete a property" do
      tags "Properties"
      produces "application/json"
      security [{ bearerAuth: [] }]

      response "200", "Property deleted successfully" do
        run_test!
      end
    end
  end
end
