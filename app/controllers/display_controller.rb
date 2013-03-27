class DisplayController < ApplicationController

  def index
    @is_signed = false
    if not current_user
      return
    end
	end

  def search_clue
    @is_clue_active = false
  end

end
