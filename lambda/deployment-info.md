# Todo App Serverless Deployment

## API Endpoints
- **Base URL**: `https://cwjxgxiidl.execute-api.us-east-1.amazonaws.com/dev`
- **Auth Registration**: `POST /auth/register`
- **Auth Login**: `POST /auth/login`
- **Auth Current User**: `GET /auth/me`
- **Get Todos**: `GET /todo`
- **Create Todo**: `POST /todo`
- **Complete Todo**: `POST /todo/{id}/completed`
- **Delete Todo**: `DELETE /todo/{id}`

## AWS Resources
- **Stack Name**: `todo-app-serverless`
- **Region**: `us-east-1`
- **Auth Lambda**: `arn:aws:lambda:us-east-1:585008070650:function:todo-auth-dev`
- **Todos Lambda**: `arn:aws:lambda:us-east-1:585008070650:function:todo-todos-dev`

## Next Steps
1. Update frontend to use the new API URL
2. Configure Route 53 to point `todo.andreiqa.click` to the API Gateway
3. Deploy frontend to S3 static hosting

## Cost Estimate
- Lambda: ~$0 (within free tier for low usage)
- API Gateway: ~$0 (within free tier for first 1M requests)
- MongoDB Atlas: $0 (free tier 512MB)
- Route 53: ~$0.50/month for hosted zone
- **Total**: ~$0.50-1.50/month