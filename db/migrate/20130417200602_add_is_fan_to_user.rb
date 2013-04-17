class AddIsFanToUser < ActiveRecord::Migration
  def change
    add_column :users, :is_fan, :boolean
  end
end
