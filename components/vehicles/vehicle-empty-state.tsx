import { Car } from 'lucide-react';

interface VehicleEmptyStateProps {
  message?: string;
  subMessage?: string;
}

export function VehicleEmptyState({
  message = 'Không có phương tiện',
  subMessage = 'Chưa có phương tiện nào được thêm vào hệ thống',
}: VehicleEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-4 mb-4">
        <Car className="h-12 w-12 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{message}</h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm">
        {subMessage}
      </p>
    </div>
  );
}
