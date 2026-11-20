# frozen_string_literal: true

require "rails_helper"

RSpec.configure do |config|
  config.openapi_root = Rails.root.join("swagger").to_s

  config.openapi_specs = {
    "v1/swagger.yaml" => {
      openapi: "3.0.1",
      info: {
        title: "LandChecker API",
        version: "v1",
        description: "REST API documentation for LandChecker."
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "Local development server"
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: :http,
            scheme: :bearer,
            bearerFormat: "JWT",
            description: "Enter your JWT token."
          }
        },
        schemas: {
          User: {
            type: :object,
            properties: {
              id: { type: :integer },
              email: { type: :string, format: :email },
              created_at: { type: :string, format: "date-time" }
            },
            required: %w[id email created_at]
          },
          RegistrationRequest: {
            type: :object,
            properties: {
              email: { type: :string, format: :email },
              password: { type: :string, minLength: 8 }
            },
            required: %w[email password]
          },
          LoginRequest: {
            type: :object,
            properties: {
              email: { type: :string, format: :email },
              password: { type: :string }
            },
            required: %w[email password]
          },
          AuthenticationResponse: {
            type: :object,
            properties: {
              message: { type: :string },
              user: { '$ref' => '#/components/schemas/User' },
              token: { type: :string }
            },
            required: %w[message user token]
          },
          CurrentUserResponse: {
            type: :object,
            properties: {
              user: { '$ref' => '#/components/schemas/User' }
            },
            required: %w[user]
          },
          ErrorResponse: {
            type: :object,
            properties: {
              error: { type: :string }
            },
            required: %w[error]
          },
          ValidationErrorResponse: {
            type: :object,
            properties: {
              errors: {
                type: :array,
                items: { type: :string }
              }
            },
            required: %w[errors]
          }
        }
      },
      security: [],
      paths: {}
    }
  }

  config.openapi_format = :yaml
end
