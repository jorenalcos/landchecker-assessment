module Api
  module V1
    class WatchlistsController < ApplicationController
      before_action :authenticate_user!
      before_action :set_watchlist, only: [:destroy]

      def index
        watchlists = current_user.watchlists.includes(:property).order(created_at: :desc)

        render json: {
          watchlists: watchlists.map { |watchlist|
            watchlist_response(watchlist)
          }
        }, status: :ok
      end

      def create
        watchlist = current_user.watchlists.new(
          property_id: params.require(:property_id)
        )

        if watchlist.save
          render json: {
            message: "Property added to watchlist",
            watchlist: watchlist_response(watchlist)
          }, status: :created
        else
          render json: {
            errors: watchlist.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      def destroy
        @watchlist.destroy!

        render json: {
          message: "Property removed from watchlist"
        }, status: :ok
      end

      private

      def set_watchlist
        @watchlist = current_user.watchlists.find(params[:id])
      end

      def watchlist_response(watchlist)
        property = watchlist.property

        {
          id: watchlist.id,
          property: {
            id: property.id,
            title: property.title,
            description: property.description,
            price: property.price,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            property_type: property.property_type,
            address: property.address,
            status: property.status
          },
          created_at: watchlist.created_at
        }
      end
    end
  end
end
