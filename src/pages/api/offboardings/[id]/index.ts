import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { offboardingValidationSchema } from 'validationSchema/offboardings';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.offboarding
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getOffboardingById();
    case 'PUT':
      return updateOffboardingById();
    case 'DELETE':
      return deleteOffboardingById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getOffboardingById() {
    const data = await prisma.offboarding.findFirst(convertQueryToPrismaUtil(req.query, 'offboarding'));
    return res.status(200).json(data);
  }

  async function updateOffboardingById() {
    await offboardingValidationSchema.validate(req.body);
    const data = await prisma.offboarding.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteOffboardingById() {
    const data = await prisma.offboarding.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
