class CreateClues < ActiveRecord::Migration
  def change
    create_table :clues do |t|
      t.string :image_url
      t.string :description
      t.float :longitude
      t.float :latitude
      t.float :radius
      t.boolean :active

      t.timestamps
    end
  end
end
