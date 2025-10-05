import type { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js"

export class NotificationsService {
    private userOwnershipWhere(userId: string) {
        return {
            alertRule: {
                OR: [
                    { property: { userId } },
                    { area: { property: { userId } } },
                    { device: { area: { property: { userId } } } }
                ]
            }
        }
    }

    async findAllByUser(userId: string, unreadOnly: boolean) {
        const whereClause: Prisma.NotificationWhereInput = {
        ...this.userOwnershipWhere(userId),
        };

        if (unreadOnly) {
        whereClause.isRead = false;
        }

        return prisma.notification.findMany({
            where: whereClause,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                alertRule: {
                    select: {
                        name: true,
                    }
                }
            }
        })
    }
    
    async getUnreadCount(userId: string) {
        return prisma.notification.count({
            where: {
                ...this.userOwnershipWhere(userId),
                isRead: false,
            },
        })
    }

    async markAsRead(notificationId: string, userId: string) {
        const result = await prisma.notification.updateMany({
            where: {
                id: notificationId,
                ...this.userOwnershipWhere(userId), // Garante que o usuário é o dono
            },
            data: {
                isRead: true,
            }
        })
        
        if (result.count === 0) {
            throw new Error("Notificação não encontrada ou não pertence ao usuário.");
        }
    }

    async markAllAsRead(userId: string) {
        return prisma.notification.updateMany({
            where: {
                ...this.userOwnershipWhere(userId),
                isRead: false // Só atualiza as que não foram lidas
            },
            data: {
                isRead: true
            }
        })
    }
}