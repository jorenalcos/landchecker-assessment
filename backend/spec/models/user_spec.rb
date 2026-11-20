require 'rails_helper'
require 'securerandom'

RSpec.describe User, type: :model do
  let(:email) { "user-#{SecureRandom.uuid}@example.com" }

  subject(:user) do
    described_class.new(
      email: email,
      password: 'SecurePassword123'
    )
  end

  describe 'validations' do
    it 'is valid with valid attributes' do
      expect(user).to be_valid
    end

    it 'requires an email' do
      user.email = nil

      expect(user).not_to be_valid
      expect(user.errors[:email]).to include("can't be blank")
    end

    it 'requires a unique email regardless of case' do
      user.save!

      duplicate = described_class.new(
        email: email.upcase,
        password: 'SecurePassword123'
      )

      expect(duplicate).not_to be_valid
      expect(duplicate.errors[:email]).to include('has already been taken')
    end

    it 'normalizes email by stripping whitespace and downcasing' do
      user.email = '  JOREN@EXAMPLE.COM  '
      user.valid?

      expect(user.email).to eq('joren@example.com')
    end

    it 'requires a password of at least 8 characters' do
      user.password = 'short'

      expect(user).not_to be_valid
      expect(user.errors[:password]).to be_present
    end
  end

  describe 'authentication' do
    it 'authenticates with the correct password' do
      user.save!

      expect(user.authenticate('SecurePassword123')).to eq(user)
    end

    it 'rejects an incorrect password' do
      user.save!

      expect(user.authenticate('WrongPassword123')).to be(false)
    end
  end

  describe 'associations' do
    it 'has many watchlists' do
      expect(user).to respond_to(:watchlists)
    end

    it 'has many watched properties through watchlists' do
      expect(user).to respond_to(:watched_properties)
    end
  end
end
