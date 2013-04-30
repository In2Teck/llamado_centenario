module AdminHelper
  def sortable(column, title = nil)
    title ||= column.titleize
    direction = column == sort_column && sort_direction == "ASC" ? "DESC" : "ASC"
    link_to title, :sort => column, :direction => direction
  end
end
