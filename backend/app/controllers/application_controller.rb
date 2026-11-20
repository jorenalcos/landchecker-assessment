class ApplicationController < ActionController::API
  private

  def authenticate_user!
    authorization = request.headers["Authorization"]
    scheme, token = authorization.to_s.split(/\s+/, 2)

    unless scheme == "Bearer" && token.present?
      return unauthorized!
    end

    payload = JsonWebToken.decode(token)

    unless payload
      return unauthorized!
    end

    user_id = payload["user_id"] || payload[:user_id]
    @current_user = User.find_by(id: user_id)

    unauthorized! unless @current_user
  end

  def unauthorized!
    render json: {
      error: "Unauthorized"
    }, status: :unauthorized
  end

  attr_reader :current_user
end
