import { TaskManagerProps } from "./TaskManagerSchema";

export function TaskManager({ tasks = [], showCompleted = false }: TaskManagerProps) {
  const safeTasks = tasks || [];
  const filteredTasks = showCompleted ? safeTasks : safeTasks.filter(task => !task.completed);

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-lg shadow-md border dark:border-white/10 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Tasks & Reminders</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {filteredTasks.length} {showCompleted ? 'total' : 'pending'} tasks
        </span>
      </div>

      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div key={task.id} className={`p-4 border rounded-lg ${
            task.completed ? 'bg-gray-50 dark:bg-slate-700/30 border-gray-200 dark:border-white/10' : 'bg-white dark:bg-slate-700/50 border-gray-300 dark:border-white/20'
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
                  <h3 className={`font-medium ${task.completed ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className={`text-sm mt-1 ${task.completed ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>
                      {task.description}
                    </p>
                  )}
                  {task.contactName && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                      Related to: {task.contactName}
                    </p>
                  )}
                </div>
              </div>
              
              {task.dueDate && (
                <div className={`text-sm ${
                  task.completed 
                    ? 'text-gray-400 dark:text-gray-500' 
                    : new Date(task.dueDate) < new Date() 
                      ? 'text-red-600 dark:text-red-400 font-medium' 
                      : 'text-gray-600 dark:text-gray-400'
                }`}>
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No {showCompleted ? '' : 'pending '}tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
}