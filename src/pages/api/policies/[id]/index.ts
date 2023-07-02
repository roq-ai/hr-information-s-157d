import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { policyValidationSchema } from 'validationSchema/policies';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.policy
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getPolicyById();
    case 'PUT':
      return updatePolicyById();
    case 'DELETE':
      return deletePolicyById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPolicyById() {
    const data = await prisma.policy.findFirst(convertQueryToPrismaUtil(req.query, 'policy'));
    return res.status(200).json(data);
  }

  async function updatePolicyById() {
    await policyValidationSchema.validate(req.body);
    const data = await prisma.policy.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deletePolicyById() {
    const data = await prisma.policy.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
