
interface LogListProps {
  logs: any[];
}

export const LogList = ({ logs }: LogListProps) => {
  return (
    <div className="bg-black/90 backdrop-blur-sm shadow-lg rounded-2xl p-8 text-green-500 font-mono">
      <h2 className="text-2xl font-bold mb-8 text-green-400">System Logs</h2>
      
      {logs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-green-500">No logs available.</p>
          <p className="text-sm text-green-600 mt-2">Execute a webhook to see logs here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="border border-green-900/30 rounded-lg p-4 hover:border-green-700/50 transition-colors"
            >
              <div className="grid grid-cols-[auto,1fr] gap-4">
                <div className="text-green-600">$</div>
                <div className="space-y-2">
                  <p className="text-green-400">
                    Webhook: {log.webhook_integrations?.name}
                  </p>
                  <p className="text-sm text-green-600">
                    URL: {log.webhook_integrations?.url}
                  </p>
                  <p className="text-sm">
                    Status: <span className={log.status === 'success' ? 'text-green-400' : 'text-red-400'}>
                      {log.status.toUpperCase()}
                    </span>
                  </p>
                  <div className="text-xs text-green-700">
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                  {log.response_data && (
                    <pre className="mt-2 p-2 bg-black/50 rounded text-xs overflow-x-auto">
                      {JSON.stringify(log.response_data, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
