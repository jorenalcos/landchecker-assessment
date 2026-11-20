module Api
  module V1
    class PropertiesController < ApplicationController
      before_action :authenticate_user!, only: %i[create update destroy]
      before_action :set_property, only: %i[show update destroy]

      rescue_from ActiveRecord::RecordNotFound, with: :render_not_found

      def index
        properties = Property.all

        properties = properties.where(property_type: params[:property_type]) if params[:property_type].present?

        properties = properties.where(status: params[:status]) if params[:status].present?

        properties = properties.where("price >= ?", params[:min_price]) if params[:min_price].present?

        properties = properties.where("price <= ?", params[:max_price]) if params[:max_price].present?

        if params[:search].present?
          search = "%#{params[:search].strip}%"
          properties = properties.where(
            "title ILIKE :search OR address ILIKE :search",
            search: search
          )
        end

        properties = properties.order(created_at: :desc)

        page = [params[:page].to_i, 1].max
        per_page = params[:per_page].present? ? params[:per_page].to_i : 10
        per_page = 10 if per_page <= 0
        per_page = [per_page, 50].min

        total_count = properties.count
        total_pages = (total_count.to_f / per_page).ceil

        properties = properties
          .limit(per_page)
          .offset((page - 1) * per_page)

        render json: {
          properties: properties.map { |property| property_response(property) },
          meta: {
            current_page: page,
            per_page: per_page,
            total_count: total_count,
            total_pages: total_pages
          }
        }, status: :ok
      end

      def show
        render json: {
          property: property_response(@property)
        }, status: :ok
      end

      def create
        property = Property.new(property_params)

        if property.save
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

        render json: {
          message: "Property deleted successfully"
        }, status: :ok
      end

      private

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
