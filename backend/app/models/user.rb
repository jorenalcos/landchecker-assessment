class User < ApplicationRecord
  has_secure_password

  has_many :watchlists, dependent: :destroy
  has_many :watched_properties,
           through: :watchlists,
           source: :property

  before_validation :normalize_email

  ROLES = %w[user admin].freeze

  validates :email,
            presence: true,
            uniqueness: { case_sensitive: false }

  validates :password,
            length: { minimum: 8 },
            if: -> { password.present? }

  validates :role, inclusion: { in: ROLES }

  def admin?
    role == "admin"
  end

  def regular_user?
    role == "user"
  end

  private

  def normalize_email
    self.email = email.to_s.strip.downcase
  end
end
