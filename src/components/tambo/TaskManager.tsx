import { TaskManagerProps } from "./TaskManagerSchema";

export function TaskManager({ tasks = [], showCompleted = false }: TaskManagerProps) {
  const safeTasks = tasks || [];
  const filteredTasks = showCompleted ? safeTasks : safeTasks.filter(task => !task.completed);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Tasks & Reminders</h2>
        <span className="text-sm text-gray-500">
          {filteredTasks.length} {showCompleted ? 'total' : 'pending'} tasks
        </span>
      </div>

      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div key={task.id} className={`p-4 border rounded-lg ${
            task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-300'
          }`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`w-5 h-5 rounded-full border-2 mt-0.5 ${
                  task.completed 
                    ? 'bg-green-500 border-green-500' 
                    : 'border-gray-300 hover:border-blue-500'
                }`}>
                  {task.completed && (
                    <svg className="w-3 h-3 text-white m-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className={`text-sm mt-1 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                      {task.description}
                    </p>
                  )}
                  {task.contactName && (
                    <p className="text-sm text-blue-600 mt-1">
                      Related to: {task.contactName}
                    </p>
                  )}
                </div>
              </div>
              
              {task.dueDate && (
                <div className={`text-sm ${
                  task.completed 
                    ? 'text-gray-400' 
                    : new Date(task.dueDate) < new Date() 
                      ? 'text-red-600 font-medium' 
                      : 'text-gray-600'
                }`}>
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No {showCompleted ? '' : 'pending '}tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
}