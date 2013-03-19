class CreateActivitiesUsersJoin < ActiveRecord::Migration
  def up
	create_table :activities_users, :id => false do |t|
		t.references :activity, :user
	end
  end

  def down
		drop_table :activities_users
  end
end
