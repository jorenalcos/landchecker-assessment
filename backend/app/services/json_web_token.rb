class JsonWebToken
  ALGORITHM = "HS256"
  EXPIRATION = 24.hours

  def self.encode(payload)
    payload = payload.merge(
      exp: EXPIRATION.from_now.to_i
    )

    JWT.encode(
      payload,
      Rails.application.secret_key_base,
      ALGORITHM
    )
  end

  def self.decode(token)
    return nil if token.blank?

    decoded = JWT.decode(
      token,
      Rails.application.secret_key_base,
      true,
      algorithm: ALGORITHM
    )

    decoded.first
  rescue JWT::DecodeError
    nil
  end
end
