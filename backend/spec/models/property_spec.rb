require 'rails_helper'

RSpec.describe Property, type: :model do
  subject(:property) do
    described_class.new(
      title: 'Modern Family House',
      description: 'A spacious family property.',
      price: 2_500_000,
      bedrooms: 3,
      bathrooms: 2,
      property_type: 'House',
      address: 'Carcar City, Cebu'
    )
  end

  describe 'validations' do
    it 'is valid with valid attributes' do
      expect(property).to be_valid
    end

    it 'requires title' do
      property.title = nil

      expect(property).not_to be_valid
      expect(property.errors[:title]).to be_present
    end

    it 'requires price' do
      property.price = nil

      expect(property).not_to be_valid
      expect(property.errors[:price]).to be_present
    end

    it 'requires bedrooms' do
      property.bedrooms = nil

      expect(property).not_to be_valid
      expect(property.errors[:bedrooms]).to be_present
    end

    it 'requires property type' do
      property.property_type = nil

      expect(property).not_to be_valid
      expect(property.errors[:property_type]).to be_present
    end

    it 'requires address' do
      property.address = nil

      expect(property).not_to be_valid
      expect(property.errors[:address]).to be_present
    end

    it 'requires price greater than zero' do
      property.price = 0

      expect(property).not_to be_valid
      expect(property.errors[:price]).to be_present
    end

    it 'requires bedrooms to be an integer' do
      property.bedrooms = 2.5

      expect(property).not_to be_valid
      expect(property.errors[:bedrooms]).to be_present
    end

    it 'allows zero bedrooms' do
      property.bedrooms = 0

      expect(property).to be_valid
    end

    it 'rejects negative bedrooms' do
      property.bedrooms = -1

      expect(property).not_to be_valid
    end
  end

  describe 'associations' do
    it 'has many watchlists' do
      expect(property).to respond_to(:watchlists)
    end

    it 'has many users through watchlists' do
      expect(property).to respond_to(:users)
    end
  end
end
