class CluesController < ApplicationController
  
  authorize_resource
  
  # GET /clues
  # GET /clues.json
  def index
    @clues = Clue.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @clues }
    end
  end

  # GET /clues/1
  # GET /clues/1.json
  def show
    @clue = Clue.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @clue }
    end
  end

  # GET /clues/new
  # GET /clues/new.json
  def new
    @clue = Clue.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @clue }
    end
  end

  # GET /clues/1/edit
  def edit
    @clue = Clue.find(params[:id])
  end

  # POST /clues
  # POST /clues.json
  def create
    @clue = Clue.new(params[:clue])

    respond_to do |format|
      if @clue.save
        format.html { redirect_to @clue, notice: 'Clue was successfully created.' }
        format.json { render json: @clue, status: :created, location: @clue }
      else
        format.html { render action: "new" }
        format.json { render json: @clue.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /clues/1
  # PUT /clues/1.json
  def update
    @clue = Clue.find(params[:id])

    respond_to do |format|
      if @clue.update_attributes(params[:clue])
        format.html { redirect_to @clue, notice: 'Clue was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @clue.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /clues/1
  # DELETE /clues/1.json
  def destroy
    @clue = Clue.find(params[:id])
    @clue.destroy

    respond_to do |format|
      format.html { redirect_to clues_url }
      format.json { head :no_content }
    end
  end

	def assign_tickets
    if params[:clue][:id].blank?
      @clue = Clue.create(params[:clue])
    else
      @clue = Clue.find(params[:clue][:id])
      @clue.update_attributes(params[:clue])
    end
    @clue.assign_tickets(params[:ticket_number])

		respond_to do |format|
      if @clue.source_type == 'web'
        format.html { redirect_to :admin_clues_list_web }
      elsif @clue.source_type == 'mobile'
        format.html { redirect_to :admin_clues_list_mobile }
      end
			format.json { render json: @clue}
		end
	end
  
  def activate_web
    @clue = Clue.find(params[:clue_id]).activate_web

    respond_to do |format|
      format.json { render json: @clue }
    end
  end

  def activate
    @clue = Clue.find(params[:clue_id]).activate

    respond_to do |format|
      format.json { render json: @clue }
    end
  end

  def deactivate
    @clue = Clue.find(params[:clue_id]).deactivate

    respond_to do |format|
      format.json { render json: @clue }
    end
  end
end
