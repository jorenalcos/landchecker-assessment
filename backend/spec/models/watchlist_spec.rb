require 'rails_helper'
require 'securerandom'

RSpec.describe Watchlist, type: :model do
  let(:user) do
    User.create!(
      email: "watchlist-#{SecureRandom.uuid}@example.com",
      password: 'SecurePassword123'
    )
  end

  let(:property) do
    Property.create!(
      title: 'Modern Family House',
      price: 2_500_000,
      bedrooms: 3,
      property_type: 'House',
      address: 'Carcar City, Cebu'
    )
  end

  subject(:watchlist) do
    described_class.new(
      user: user,
      property: property
    )
  end

  describe 'associations' do
    it 'belongs to a user' do
      expect(watchlist.user).to eq(user)
    end

    it 'belongs to a property' do
      expect(watchlist.property).to eq(property)
    end
  end

  describe 'validations' do
    it 'is valid with a user and property' do
      expect(watchlist).to be_valid
    end

    it 'prevents a user from adding the same property twice' do
      watchlist.save!

      duplicate = described_class.new(
        user: user,
        property: property
      )

      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:property_id]).to be_present
    end

    it 'allows different users to watch the same property' do
      watchlist.save!

      another_user = User.create!(
        email: 'another@example.com',
        password: 'SecurePassword123'
      )

      another_watchlist = described_class.new(
        user: another_user,
        property: property
      )

      expect(another_watchlist).to be_valid
    end
  end
end
