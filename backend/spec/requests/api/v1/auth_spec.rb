require "swagger_helper"

RSpec.describe "API V1 Authentication", type: :request do
  let(:email) { "test@example.com" }
  let(:password) { "SecurePassword123" }

  path "/api/v1/auth/register" do
    post "Register a new user" do
      tags "Authentication"
      consumes "application/json"
      produces "application/json"

      parameter name: :credentials,
                in: :body,
                schema: {
                  '$ref' => '#/components/schemas/RegistrationRequest'
                }

      response "201", "Registration successful" do
        let(:credentials) do
          { email: email, password: password }
        end

        schema '$ref' => '#/components/schemas/AuthenticationResponse'

        run_test!
      end

      response "201", "Registration ignores admin role assignment" do
        let(:credentials) do
          {
            email: "role-test@example.com",
            password: password,
            role: "admin"
          }
        end

        run_test! do
          user = User.find_by(email: "role-test@example.com")

          expect(user.role).to eq("user")
        end
      end

      response "422", "Duplicate email address" do
        before do
          User.create!(email: email, password: password)
        end

        let(:credentials) do
          { email: email, password: password }
        end

        schema '$ref' => '#/components/schemas/ValidationErrorResponse'

        run_test!
      end
    end
  end

  path "/api/v1/auth/login" do
    post "Login user" do
      tags "Authentication"
      consumes "application/json"
      produces "application/json"

      parameter name: :credentials,
                in: :body,
                schema: {
                  '$ref' => '#/components/schemas/LoginRequest'
                }

      response "200", "Login successful" do
        before do
          User.create!(email: email, password: password)
        end

        let(:credentials) do
          { email: email, password: password }
        end

        schema '$ref' => '#/components/schemas/AuthenticationResponse'

        run_test!
      end

      response "401", "Incorrect password" do
        before do
          User.create!(email: email, password: password)
        end

        let(:credentials) do
          { email: email, password: "WrongPassword123" }
        end

        schema '$ref' => '#/components/schemas/ErrorResponse'

        run_test!
      end

      response "401", "Unknown email" do
        let(:credentials) do
          { email: "unknown@example.com", password: password }
        end

        schema '$ref' => '#/components/schemas/ErrorResponse'

        run_test!
      end
    end
  end

  path "/api/v1/auth/me" do
    get "Get authenticated user" do
      tags "Authentication"
      produces "application/json"

      security [{ bearerAuth: [] }]

      response "200", "Authenticated user returned" do
        let(:user) do
          User.create!(email: email, password: password)
        end

        let(:token) do
          JsonWebToken.encode(user_id: user.id)
        end

        let(:Authorization) { "Bearer #{token}" }

        schema '$ref' => '#/components/schemas/CurrentUserResponse'

        run_test!
      end

      response "401", "Missing authentication token" do
        let(:Authorization) { nil }

        run_test!
      end

      response "401", "Invalid authentication token" do
        let(:Authorization) { "Bearer invalid.token.value" }

        schema '$ref' => '#/components/schemas/ErrorResponse'

        run_test!
      end

      response "401", "Expired authentication token" do
        let(:user) do
          User.create!(email: email, password: password)
        end

        let(:token) do
          JWT.encode(
            { user_id: user.id, exp: 1 },
            Rails.application.secret_key_base,
            JsonWebToken::ALGORITHM
          )
        end

        let(:Authorization) { "Bearer #{token}" }

        run_test!
      end
    end
  end
end