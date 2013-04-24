class AddAvatarColumnsToClues < ActiveRecord::Migration
  def self.up
    add_attachment :clues, :avatar
  end

  def self.down
    remove_attachment :clues, :avatar
  end
end
