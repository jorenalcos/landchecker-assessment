module Api
  module V1
    class AuthController < ApplicationController
      before_action :authenticate_user!, only: [ :me ]

      def register
        user = User.new(user_params)

        if user.save
          token = JsonWebToken.encode(user_id: user.id)

          render json: {
            message: "Registration successful",
            user: user_response(user),
            token: token
          }, status: :created
        else
          render json: {
            errors: user.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      def login
        user = User.find_by(
          "LOWER(email) = ?",
          params[:email].to_s.strip.downcase
        )

        if user&.authenticate(params[:password])
          token = JsonWebToken.encode(user_id: user.id)

          render json: {
            message: "Login successful",
            user: user_response(user),
            token: token
          }, status: :ok
        else
          render json: {
            error: "Invalid email or password"
          }, status: :unauthorized
        end
      end

      def me
        render json: {
          user: user_response(current_user)
        }, status: :ok
      end

      private

      def user_params
        params.permit(:email, :password)
      end

      def user_response(user)
        {
          id: user.id,
          email: user.email,
          role: user.role,
          created_at: user.created_at
        }
      end
    end
  end
end
