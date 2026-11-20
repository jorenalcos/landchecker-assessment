
require "rails_helper"

RSpec.describe "API Rate Limiting", type: :request do
  let(:test_ip) { "203.0.113.25" }

  let(:login_params) do
    {
      email: "rate-limit@example.com",
      password: "wrong-password"
    }
  end

  before do
    Rack::Attack.cache.store.clear
    host! "www.example.com"
  end

  it "diagnoses login responses before testing the throttle" do
    6.times do |i|
      post "/api/v1/auth/login",
           params: login_params,
           headers: { "REMOTE_ADDR" => test_ip }

      puts "\nRequest #{i + 1}"
      puts "Status: #{response.status}"
      puts "Content-Type: #{response.media_type}"
      puts "Body: #{response.body[0, 2500]}"
    end
  end
end
