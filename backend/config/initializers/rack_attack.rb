class Rack::Attack
  # Development and test only.
  # Use a shared cache store for production.
  self.cache.store = ActiveSupport::Cache::MemoryStore.new

  # General API limit: 100 requests per IP per minute.
  throttle("api/ip", limit: 100, period: 1.minute) do |req|
    req.ip if req.path.start_with?("/api/")
  end

  # Login: 5 attempts per IP per minute.
  throttle("auth/login/ip", limit: 5, period: 1.minute) do |req|
    req.ip if req.post? && req.path == "/api/v1/auth/login"
  end

  # Registration: 5 attempts per IP per minute.
  throttle("auth/register/ip", limit: 5, period: 1.minute) do |req|
    req.ip if req.post? && req.path == "/api/v1/auth/register"
  end

  # Property creation: 20 requests per IP per minute.
  throttle("properties/create/ip", limit: 20, period: 1.minute) do |req|
    req.ip if req.post? && req.path == "/api/v1/properties"
  end

  # Watchlist creation: 20 requests per IP per minute.
  throttle("watchlists/create/ip", limit: 20, period: 1.minute) do |req|
    req.ip if req.post? && req.path == "/api/v1/watchlists"
  end

  self.throttled_responder = lambda do |_request|
    [
      429,
      { "Content-Type" => "application/json" },
      [{ error: "Too many requests. Please try again later." }.to_json]
    ]
  end
end