import { Router } from "express";
import { requireAuth, requireDeveloper } from "../middleware/auth.middleware";
import { applicationController } from "../controllers/application.controller";
import { envVarController } from "../controllers/env-var.controller";
import { errorController } from "../controllers/error.controller";
import { deploymentStatusController } from "../controllers/deployment-status.controller";

const router = Router();

router.get("/", requireAuth, (req, res) =>
  applicationController.listApplications(req, res)
);
router.post("/", requireDeveloper, (req, res) =>
  applicationController.deployApplication(req, res)
);
router.post("/:id/start", requireDeveloper, (req, res) =>
  applicationController.startApplication(req, res)
);
router.post("/:id/stop", requireDeveloper, (req, res) =>
  applicationController.stopApplication(req, res)
);
router.post("/:id/restart", requireDeveloper, (req, res) =>
  applicationController.restartApplication(req, res)
);
router.get("/:id/logs", requireAuth, (req, res) =>
  applicationController.getApplicationLogs(req, res)
);
router.get("/:id/env-vars", requireAuth, (req, res) =>
  envVarController.getEnvVars(req, res)
);
router.post("/:id/env-vars", requireDeveloper, (req, res) =>
  envVarController.setEnvVar(req, res)
);
router.delete("/:id/env-vars/:key", requireDeveloper, (req, res) =>
  envVarController.deleteEnvVar(req, res)
);
router.get("/:id/errors", requireAuth, (req, res) =>
  errorController.getErrors(req, res)
);
router.delete("/:id/errors", requireDeveloper, (req, res) =>
  errorController.clearErrors(req, res)
);
router.get("/:id/deployment-status", requireAuth, (req, res) =>
  deploymentStatusController.getStatus(req, res)
);
router.delete("/:id/deployment-status", requireDeveloper, (req, res) =>
  deploymentStatusController.clearStatus(req, res)
);
router.delete("/:id", requireDeveloper, (req, res) =>
  applicationController.removeApplication(req, res)
);

export default router;
