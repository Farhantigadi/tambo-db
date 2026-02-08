import { ContactCardProps } from "./ContactCardSchema";

export function ContactCard({ contacts = [], viewType = "card" }: ContactCardProps) {
  const safeContacts = contacts || [];
  if (viewType === "table") {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-slate-800/90 border border-gray-200 dark:border-white/10">
          <thead className="bg-gray-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Company</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Last Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-white/10">
            {safeContacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900 dark:text-white">{contact.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{contact.position}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{contact.company}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{contact.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    contact.status === 'customer' ? 'bg-green-100 text-green-800' :
                    contact.status === 'active' ? 'bg-blue-100 text-blue-800' :
                    contact.status === 'prospect' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {contact.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {contact.lastContactDate ? new Date(contact.lastContactDate).toLocaleDateString() : 'Never'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (viewType === "compact") {
    return (
      <div className="space-y-2">
        {safeContacts.map((contact) => (
          <div key={contact.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-700/50 border dark:border-white/10 rounded-lg hover:shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                {contact.name.charAt(0)}
              </div>
              <div>
                <div className="font-medium dark:text-white">{contact.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{contact.company}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium dark:text-gray-200">{contact.email}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{contact.phone}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default card view
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {safeContacts.map((contact) => (
        <div key={contact.id} className="bg-white dark:bg-slate-800/90 rounded-lg shadow-md border dark:border-white/10 p-6 hover:shadow-lg transition-shadow backdrop-blur-sm">
          <div className="flex items-center space-x-4 mb-4">
             <div className="w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {contact?.name?.charAt(0) || '?'}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{contact.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{contact.position}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Company:</span>
              <span className="ml-2">{contact.company || 'N/A'}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Email:</span>
              <span className="ml-2">{contact.email}</span>
            </div>
            {contact.phone && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Phone:</span>
                <span className="ml-2">{contact.phone}</span>
              </div>
            )}
            <div className="flex items-center justify-between mt-4">
              <span className={`px-3 py-1 text-xs rounded-full ${
                contact.status === 'customer' ? 'bg-green-100 text-green-800' :
                contact.status === 'active' ? 'bg-blue-100 text-blue-800' :
                contact.status === 'prospect' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {contact.status}
              </span>
              <span className="text-xs text-gray-500">
                Last: {contact.lastContactDate ? new Date(contact.lastContactDate).toLocaleDateString() : 'Never'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}