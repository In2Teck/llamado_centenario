class AddAssignedToTicket < ActiveRecord::Migration
  def change
    add_column :tickets, :assigned, :boolean, :default => false
  end
end
