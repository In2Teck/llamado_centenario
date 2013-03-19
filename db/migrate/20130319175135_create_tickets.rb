class CreateTickets < ActiveRecord::Migration
  def change
    create_table :tickets do |t|
      t.integer :clue_id
      t.string :folio
      t.string :source_type

      t.timestamps
    end
  end
end
