class AddFieldsToUser < ActiveRecord::Migration
  def change
    add_column :users, :ticket_id, :integer
    add_column :users, :referred_user_id, :integer
    add_column :users, :friend_count, :integer
  end
end
