
module Api
  module V1
    class PropertiesController < ApplicationController
      before_action :authenticate_user!, only: %i[create update destroy]
      before_action :authorize_admin!, only: %i[create update destroy]
      before_action :set_property, only: %i[show update destroy]

      rescue_from ActiveRecord::RecordNotFound, with: :render_not_found

      PROPERTY_CACHE_VERSION_KEY = "landchecker:properties:collection_version"

      def index
        page = [params[:page].to_i, 1].max

        per_page = params[:per_page].present? ? params[:per_page].to_i : 10
        per_page = 10 if per_page <= 0
        per_page = [per_page, 50].min

        filters = {
          property_type: params[:property_type],
          status: params[:status],
          min_price: params[:min_price],
          max_price: params[:max_price],
          search: params[:search]&.strip,
          page: page,
          per_page: per_page
        }

        version = Rails.cache.fetch(PROPERTY_CACHE_VERSION_KEY) do
          0
        end

        cache_key = [
          "landchecker",
          "properties",
          "index",
          "v1",
          version,
          Digest::SHA256.hexdigest(filters.to_json)
        ].join(":")

        result = Rails.cache.fetch(cache_key, expires_in: 5.minutes) do
          properties = filtered_properties(filters)

          total_count = properties.count
          total_pages = (total_count.to_f / per_page).ceil

          records = properties
            .limit(per_page)
            .offset((page - 1) * per_page)

          {
            properties: records.map { |property| property_response(property) },
            meta: {
              current_page: page,
              per_page: per_page,
              total_count: total_count,
              total_pages: total_pages
            }
          }
        end

        render json: result, status: :ok
      end

      def show
        cache_key = [
          "landchecker",
          "properties",
          "show",
          @property.cache_key_with_version
        ].join(":")

        property_data = Rails.cache.fetch(cache_key, expires_in: 10.minutes) do
          property_response(@property)
        end

        render json: {
          property: property_data
        }, status: :ok
      end

      def create
        property = Property.new(property_params)

        if property.save
          invalidate_property_cache!

          render json: {
            message: "Property created successfully",
            property: property_response(property)
          }, status: :created
        else
          render json: {
            errors: property.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      def update
        if @property.update(property_params)
          invalidate_property_cache!

          render json: {
            message: "Property updated successfully",
            property: property_response(@property)
          }, status: :ok
        else
          render json: {
            errors: @property.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      def destroy
        @property.destroy!

        invalidate_property_cache!

        render json: {
          message: "Property deleted successfully"
        }, status: :ok
      end

      private

      def filtered_properties(filters)
        properties = Property.all

        if filters[:property_type].present?
          properties = properties.where(property_type: filters[:property_type])
        end

        if filters[:status].present?
          properties = properties.where(status: filters[:status])
        end

        if filters[:min_price].present?
          properties = properties.where("price >= ?", filters[:min_price])
        end

        if filters[:max_price].present?
          properties = properties.where("price <= ?", filters[:max_price])
        end

        if filters[:search].present?
          search = "%#{filters[:search]}%"

          properties = properties.where(
            "title ILIKE :search OR address ILIKE :search",
            search: search
          )
        end

        properties.order(created_at: :desc)
      end

      def invalidate_property_cache!
        Rails.cache.increment(
          PROPERTY_CACHE_VERSION_KEY,
          1,
          initial: 0
        )
      end

      def set_property
        @property = Property.find(params[:id])
      end

      def property_params
        params.require(:property).permit(
          :title,
          :description,
          :price,
          :bedrooms,
          :bathrooms,
          :property_type,
          :address,
          :status
        )
      end

      def property_response(property)
        {
          id: property.id,
          title: property.title,
          description: property.description,
          price: property.price,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          property_type: property.property_type,
          address: property.address,
          status: property.status,
          created_at: property.created_at,
          updated_at: property.updated_at
        }
      end

      def render_not_found
        render json: {
          error: "Property not found"
        }, status: :not_found
      end
    end
  end
end
