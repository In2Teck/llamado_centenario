class CreateCluesUsersJoin < ActiveRecord::Migration
  def up
  create_table :clues_users, :id => false do |t|
    t.references :clue, :user
  end
  end

  def down
    drop_table :clues_users
  end
end
