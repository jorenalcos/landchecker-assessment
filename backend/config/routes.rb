Rails.application.routes.draw do
  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      post "auth/register", to: "auth#register"
      post "auth/login", to: "auth#login"
      get "auth/me", to: "auth#me"

      resources :properties, only: %i[index show create update destroy]
      resources :watchlists, only: [:index, :create, :destroy]
    end
  end
end
