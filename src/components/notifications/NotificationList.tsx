import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, MoreHorizontal, Bell } from "lucide-react";
import { useNotifications, type Notification } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

function NotificationItem({ notification, onMarkAsRead }: { 
  notification: Notification; 
  onMarkAsRead: (id: string) => void;
}) {
  const IconComponent = notification.type === 'like' ? Heart : MessageCircle;
  
  return (
    <div 
      className={cn(
        "p-3 border-b border-border/50 hover:bg-muted/50 cursor-pointer transition-colors",
        !notification.is_read && "bg-primary/5"
      )}
      onClick={() => onMarkAsRead(notification.id)}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "rounded-full p-2 flex-shrink-0",
          notification.type === 'like' ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
        )}>
          <IconComponent className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">
              {notification.title}
            </h4>
            {!notification.is_read && (
              <Badge variant="secondary" className="h-2 w-2 p-0 rounded-full" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
}

export function NotificationList() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

  if (loading) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="max-h-96">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
        </div>
      </div>
      
      {notifications.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No notifications yet</p>
          <p className="text-xs mt-1">You'll see likes and comments here</p>
        </div>
      ) : (
        <ScrollArea className="max-h-80">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
            />
          ))}
        </ScrollArea>
      )}
    </div>
  );
}