class ApplicationController < ActionController::API
  private

  def authenticate_user!
    authorization = request.headers["Authorization"]
    scheme, token = authorization.to_s.split(/\s+/, 2)

    unless scheme == "Bearer" && token.present?
      return unauthorized!
    end

    payload = JsonWebToken.decode(token)

    return unauthorized! unless payload

    user_id = payload["user_id"] || payload[:user_id]
    @current_user = User.find_by(id: user_id)

    unauthorized! unless @current_user
  end

  def authorize_admin!
    return forbidden! unless current_user&.admin?
  end

  def unauthorized!
    render json: {
      error: "Unauthorized"
    }, status: :unauthorized
  end

  def forbidden!
    render json: {
      error: "Forbidden",
      message: "You do not have permission to perform this action."
    }, status: :forbidden
  end

  attr_reader :current_user
end
