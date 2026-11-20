class Property < ApplicationRecord
  has_many :watchlists, dependent: :destroy
  has_many :users, through: :watchlists

  validates :title, :price, :bedrooms,
            :property_type, :address, presence: true

  validates :price, numericality: { greater_than: 0 }

  validates :bedrooms, numericality: {
    only_integer: true,
    greater_than_or_equal_to: 0
  }
end
