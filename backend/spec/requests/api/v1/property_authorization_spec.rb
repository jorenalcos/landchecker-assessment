require "rails_helper"

RSpec.describe "API V1 Property Authorization", type: :request do
  let(:password) { "SecurePassword123" }

  let(:regular_user) do
    User.create!(
      email: "regular@example.com",
      password: password,
      role: "user"
    )
  end

  let(:admin) do
    User.create!(
      email: "admin@example.com",
      password: password,
      role: "admin"
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

  def auth_headers(user)
    token = JsonWebToken.encode(user_id: user.id)

    {
      "Authorization" => "Bearer #{token}",
      "Content-Type" => "application/json"
    }
  end

  describe "regular user permissions" do
    it "cannot create a property" do
      expect {
        post "/api/v1/properties",
             params: {
               property: {
                 title: "Unauthorized Property",
                 description: "Should not be created",
                 price: 1_000_000,
                 bedrooms: 2,
                 bathrooms: 1,
                 property_type: "house",
                 address: "Carcar City, Cebu"
               }
             },
             headers: auth_headers(regular_user),
             as: :json
      }.not_to change(Property, :count)

      expect(response).to have_http_status(:forbidden)
    end

    it "cannot update a property" do
      property

      expect {
        patch "/api/v1/properties/#{property.id}",
              params: {
                property: { title: "Unauthorized Update" }
              },
              headers: auth_headers(regular_user),
              as: :json
      }.not_to change { property.reload.title }

      expect(response).to have_http_status(:forbidden)
    end

    it "cannot delete a property" do
      property

      expect {
        delete "/api/v1/properties/#{property.id}",
               headers: auth_headers(regular_user),
               as: :json
      }.not_to change(Property, :count)

      expect(response).to have_http_status(:forbidden)
    end
  end

  describe "admin permissions" do
    it "can create a property" do
      expect {
        post "/api/v1/properties",
             params: {
               property: {
                 title: "Admin Created Property",
                 description: "Created by admin",
                 price: 2_000_000,
                 bedrooms: 3,
                 bathrooms: 2,
                 property_type: "house",
                 address: "Carcar City, Cebu"
               }
             },
             headers: auth_headers(admin),
             as: :json
      }.to change(Property, :count).by(1)

      expect(response).to have_http_status(:created)
    end

    it "can update a property" do
      property

      patch "/api/v1/properties/#{property.id}",
            params: {
              property: { title: "Admin Updated Property" }
            },
            headers: auth_headers(admin),
            as: :json

      expect(response).to have_http_status(:ok)
      expect(property.reload.title).to eq("Admin Updated Property")
    end

    it "can delete a property" do
      property

      expect {
        delete "/api/v1/properties/#{property.id}",
               headers: auth_headers(admin),
               as: :json
      }.to change(Property, :count).by(-1)

      expect(response).to have_http_status(:ok)
    end
  end
end
