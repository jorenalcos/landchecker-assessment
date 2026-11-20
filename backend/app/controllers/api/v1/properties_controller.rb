module Api
  module V1
    class PropertiesController < ApplicationController
      before_action :authenticate_user!, only: %i[create update destroy]
      before_action :set_property, only: %i[show update destroy]

      rescue_from ActiveRecord::RecordNotFound, with: :render_not_found

      def index
        properties = Property.order(created_at: :desc)

        render json: {
          properties: properties.map { |property| property_response(property) }
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
