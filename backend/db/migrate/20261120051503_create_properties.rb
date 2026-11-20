class CreateProperties < ActiveRecord::Migration[8.1]
  def change
    create_table :properties do |t|
      t.string :title, null: false
      t.text :description
      t.decimal :price, precision: 12, scale: 2, null: false
      t.integer :bedrooms, null: false
      t.integer :bathrooms
      t.string :property_type, null: false
      t.string :address, null: false
      t.string :status, default: "available"

      t.timestamps
    end

    add_index :properties, :price
    add_index :properties, :bedrooms
    add_index :properties, :property_type
    add_index :properties, :status
  end
end
