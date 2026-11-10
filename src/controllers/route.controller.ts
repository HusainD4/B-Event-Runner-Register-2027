import type { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database';
import type { AuthenticatedRequest } from '../middlewares/auth';

const routePointSchema = z.object({
  name: z.string().min(2, 'Nama checkpoint/titik kumpul minimal 2 karakter'),
  distanceKm: z.string().min(1, 'Jarak KM wajib diisi (contoh: Km 0.0)'),
  category: z.string().default('ALL'),
  description: z.string().min(2, 'Deskripsi fasilitas minimal 2 karakter'),
  icon: z.string().nullable().optional(),
  image: z.string().url().nullable().optional(),
  isWaterStation: z.boolean().default(false),
  isMedicalSpot: z.boolean().default(false),
  orderIndex: z.number().int().default(0),
});

/**
 * Mengambil daftar Checkpoint & Titik Kumpul Rute Resmi (Public)
 */
export const getRoutePoints = async (req: Request, res: Response): Promise<any> => {
  try {
    const points = await prisma.routePoint.findMany({
      orderBy: { orderIndex: 'asc' },
    });

    return res.status(200).json({
      status: 'success',
      data: points,
    });
  } catch (error: any) {
    console.error('🚨 [GET ROUTE POINTS ERROR]:', error);
    return res.status(200).json({
      status: 'success',
      data: [],
    });
  }
};

/**
 * Mengambil informasi lengkap rute, specs, dan checkpoints (Public)
 */
export const getRouteOverview = async (req: Request, res: Response): Promise<any> => {
  try {
    const [points, settings] = await Promise.all([
      prisma.routePoint.findMany({ orderBy: { orderIndex: 'asc' } }).catch(() => []),
      prisma.appSetting.findMany({
        where: {
          key: {
            in: [
              'route_title',
              'route_desc',
              'route_specs_start_10k',
              'route_specs_start_5k',
              'route_specs_cot_10k',
              'route_specs_cot_5k',
              'route_gpx_url',
              'route_gmaps_url',
              'gmaps_embed_url',
              'route_map_image',
            ],
          },
        },
      }).catch(() => []),
    ]);

    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return res.status(200).json({
      status: 'success',
      data: {
        title: settingsMap.route_title || '',
        description: settingsMap.route_desc || '',
        specs: {
          start10k: settingsMap.route_specs_start_10k || '',
          start5k: settingsMap.route_specs_start_5k || '',
          cot10k: settingsMap.route_specs_cot_10k || '',
          cot5k: settingsMap.route_specs_cot_5k || '',
        },
        gpxUrl: settingsMap.route_gpx_url || '',
        gmapsUrl: settingsMap.route_gmaps_url || settingsMap.gmaps_embed_url || '',
        routeMapImage: settingsMap.route_map_image || '',
        points: points,
      },
    });
  } catch (error: any) {
    console.error('🚨 [GET ROUTE OVERVIEW ERROR]:', error);
    return res.status(200).json({
      status: 'success',
      data: {
        title: '',
        description: '',
        specs: {
          start10k: '',
          start5k: '',
          cot10k: '',
          cot5k: '',
        },
        gpxUrl: '',
        gmapsUrl: '',
        routeMapImage: '',
        points: [],
      },
    });
  }
};

/**
 * Menambahkan titik kumpul / checkpoint rute baru (Admin Only)
 */
export const createRoutePoint = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const validated = routePointSchema.parse(req.body);

    const point = await prisma.routePoint.create({
      data: validated,
    });

    await prisma.log.create({
      data: {
        action: 'ROUTE_POINT_CREATE',
        description: `Admin menambahkan checkpoint rute baru: "${point.name}" (${point.distanceKm})`,
        adminId: req.admin?.adminId,
        entityType: 'RoutePoint',
        entityId: point.id,
      },
    }).catch(() => null);

    return res.status(201).json({
      status: 'success',
      message: 'Titik rute resmi berhasil ditambahkan.',
      data: point,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ status: 'error', message: error.errors[0].message });
    }
    console.error('🚨 [CREATE ROUTE POINT ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal menambahkan titik rute.' });
  }
};

/**
 * Mengupdate data titik kumpul / checkpoint rute (Admin Only)
 */
export const updateRoutePoint = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;
    const validated = routePointSchema.partial().parse(req.body);

    const point = await prisma.routePoint.update({
      where: { id },
      data: validated,
    });

    await prisma.log.create({
      data: {
        action: 'ROUTE_POINT_UPDATE',
        description: `Admin memperbarui checkpoint rute: "${point.name}"`,
        adminId: req.admin?.adminId,
        entityType: 'RoutePoint',
        entityId: point.id,
      },
    }).catch(() => null);

    return res.status(200).json({
      status: 'success',
      message: 'Titik rute berhasil diperbarui.',
      data: point,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ status: 'error', message: error.errors[0].message });
    }
    console.error('🚨 [UPDATE ROUTE POINT ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal memperbarui titik rute.' });
  }
};

/**
 * Menghapus titik kumpul / checkpoint rute (Admin Only)
 */
export const deleteRoutePoint = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;

    const point = await prisma.routePoint.delete({
      where: { id },
    });

    await prisma.log.create({
      data: {
        action: 'ROUTE_POINT_DELETE',
        description: `Admin menghapus checkpoint rute: "${point.name}"`,
        adminId: req.admin?.adminId,
        entityType: 'RoutePoint',
        entityId: id,
      },
    }).catch(() => null);

    return res.status(200).json({
      status: 'success',
      message: 'Titik rute berhasil dihapus dari database.',
    });
  } catch (error: any) {
    console.error('🚨 [DELETE ROUTE POINT ERROR]:', error);
    return res.status(500).json({ status: 'error', message: 'Gagal menghapus titik rute.' });
  }
};

