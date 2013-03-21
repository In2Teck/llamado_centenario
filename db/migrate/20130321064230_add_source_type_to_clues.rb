class AddSourceTypeToClues < ActiveRecord::Migration
  def change
    add_column :clues, :source_type, :string
  end
end
