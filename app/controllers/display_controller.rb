class DisplayController < ApplicationController

  def index
    @is_signed = false
    if current_user
      @is_signed = true
    end
	end

  def search_clue
    @is_clue_active = false
  end

end
