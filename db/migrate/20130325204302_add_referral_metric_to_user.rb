class AddReferralMetricToUser < ActiveRecord::Migration
  def change
    add_column :users, :referral_metric, :float
  end
end
