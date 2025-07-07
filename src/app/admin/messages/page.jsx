'use client';

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody, 
  Typography, 
  Button, 
  Badge,
  Input,
  Select,
  Option,
  IconButton
} from '@material-tailwind/react';
import { 
  ArrowPathIcon, 
  CalendarDaysIcon,
  FunnelIcon 
} from '@heroicons/react/24/outline';
import AdminLayout from '@/components/admin/AdminLayout';
import Pagination from '@/components/ui/Pagination';
import { formatDistanceToNow, format } from 'date-fns';
import { toast } from 'react-hot-toast';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchMessages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit]);

  const buildQueryParams = () => {
    const params = new URLSearchParams({
      page: pagination.page.toString(),
      limit: pagination.limit.toString(),
    });
    
    if (filters.fromDate) {
      params.append('fromDate', filters.fromDate);
    }
    if (filters.toDate) {
      params.append('toDate', filters.toDate);
    }
    
    return params.toString();
  };

  const fetchMessages = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    else setLoading(true);
    
    try {
      const queryParams = buildQueryParams();
      const response = await fetch(`/api/contact?${queryParams}`);
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        setPagination(data.pagination || pagination);
      } else {
        toast.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchMessages(true);
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: true }),
      });

      if (response.ok) {
        setMessages(messages.map(msg => 
          msg.id === messageId ? { ...msg, read: true } : msg
        ));
        toast.success('Message marked as read');
      } else {
        toast.error('Failed to mark message as read');
      }
    } catch (error) {
      console.error('Failed to mark message as read:', error);
      toast.error('Failed to mark message as read');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages(messages.filter(msg => msg.id !== messageId));
        toast.success('Message deleted successfully');
        
        // If this was the last message on the page and we're not on page 1, go to previous page
        if (messages.length === 1 && pagination.page > 1) {
          setPagination(prev => ({ ...prev, page: prev.page - 1 }));
        } else {
          // Refresh to get updated counts
          fetchMessages();
        }
      } else {
        toast.error('Failed to delete message');
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
      toast.error('Failed to delete message');
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
    fetchMessages();
  };

  const clearFilters = () => {
    setFilters({ fromDate: '', toDate: '' });
    setPagination(prev => ({ ...prev, page: 1 }));
    // Fetch without filters
    setTimeout(fetchMessages, 100);
  };

  const goToPage = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <Typography variant="h2" color="blue-gray" className="mb-2">
              Contact Messages
            </Typography>
            <Typography color="gray">
              View and manage contact form submissions
            </Typography>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outlined"
              color="gray"
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FunnelIcon className="h-4 w-4" />
              Filters
            </Button>
            
            <Button
              variant="outlined"
              color="teal"
              className="flex items-center gap-2"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <ArrowPathIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-6">
            <CardBody>
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Filter Messages
              </Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Input
                  type="date"
                  label="From Date"
                  value={filters.fromDate}
                  onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                  icon={<CalendarDaysIcon />}
                />
                <Input
                  type="date"
                  label="To Date"
                  value={filters.toDate}
                  onChange={(e) => handleFilterChange('toDate', e.target.value)}
                  icon={<CalendarDaysIcon />}
                />
                <div className="flex gap-2">
                  <Button
                    color="teal"
                    onClick={applyFilters}
                    className="flex-1"
                  >
                    Apply
                  </Button>
                  <Button
                    variant="outlined"
                    color="gray"
                    onClick={clearFilters}
                    className="flex-1"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Results Summary */}
        {!loading && (
          <div className="flex justify-between items-center">
            <Typography color="gray" className="text-sm">
              Showing {messages.length} of {pagination.totalCount} messages
            </Typography>
            
            <Select
              value={pagination.limit.toString()}
              onChange={(value) => setPagination(prev => ({ ...prev, limit: parseInt(value), page: 1 }))}
              className="w-32"
            >
              <Option value="5">5 per page</Option>
              <Option value="10">10 per page</Option>
              <Option value="20">20 per page</Option>
              <Option value="50">50 per page</Option>
            </Select>
          </div>
        )}

        {/* Messages */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <Card>
                <CardBody className="text-center py-12">
                  <Typography color="gray">
                    No messages found.
                  </Typography>
                </CardBody>
              </Card>
            ) : (
              messages.map((message) => (
                <Card key={message.id} className={!message.read ? 'ring-2 ring-teal-500' : ''}>
                  <CardBody>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        {!message.read && (
                          <Badge color="teal" value="New" />
                        )}

                        <Typography variant="h6" color="blue-gray">
                          {message.name}
                        </Typography>
                        
                      </div>
                      <Typography color="gray" className="text-sm">
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      </Typography>
                    </div>

                    <div className="mb-4">
                      <Typography color="gray" className="text-sm mb-1">
                        Email: {message.email}
                      </Typography>
                      {message.subject && (
                        <Typography color="gray" className="text-sm">
                          Subject: {message.subject}
                        </Typography>
                      )}
                    </div>

                    <Typography color="blue-gray" className="mb-4">
                      {message.message}
                    </Typography>

                    <div className="flex gap-2">
                      {!message.read && (
                        <Button
                          size="sm"
                          color="teal"
                          variant="outlined"
                          onClick={() => handleMarkAsRead(message.id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                      <Button
                        size="sm"
                        color="red"
                        variant="outlined"
                        onClick={() => handleDeleteMessage(message.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalCount}
              itemsPerPage={pagination.limit}
              onPageChange={goToPage}
              showInfo={true}
              showQuickJump={pagination.totalPages > 10}
              className="justify-center"
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
