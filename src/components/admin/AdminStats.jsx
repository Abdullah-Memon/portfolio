'use client';

import { Card, CardBody, Typography } from '@material-tailwind/react';
import {
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  EyeIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

export default function AdminStats({ stats }) {
  const statCards = [
    {
      title: 'Total Posts',
      value: stats.totalPosts || 0,
      icon: DocumentTextIcon,
      color: 'teal',
    },
    {
      title: 'Total Messages',
      value: stats.totalMessages || 0,
      icon: ChatBubbleLeftIcon,
      color: 'green',
    },
    {
      title: 'Unread Messages',
      value: stats.unreadMessages || 0,
      icon: EyeIcon,
      color: 'orange',
    },
    {
      title: 'Published Posts',
      value: stats.publishedPosts || 0,
      icon: HeartIcon,
      color: 'purple',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="shadow-sm">
          <CardBody className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Typography color="blue-gray" className="font-normal text-sm">
                  {stat.title}
                </Typography>
                <Typography variant="h4" color="blue-gray" className="mt-2">
                  {stat.value}
                </Typography>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-50`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-500`} />
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
