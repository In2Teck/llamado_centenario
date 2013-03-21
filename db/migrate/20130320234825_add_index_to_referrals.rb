class AddIndexToReferrals < ActiveRecord::Migration
  def change
		add_index :referrals, [:user_id, :referred_uid], :unique => true
  end
end
